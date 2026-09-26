import os

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

from core.vector_store import (
    build_vector_store,
    load_vector_store,
    get_retriever,
)


def get_llm():
    return ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=0.4,
        groq_api_key=os.getenv("GROQ_API_KEY"),
    )


def format_docs(docs):
    return "\n\n".join(
        [
            f"[{doc.metadata.get('type', 'context')}]\n{doc.page_content}"
            for doc in docs
        ]
    )


def create_prompt():
    return ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are Veyra, an AI assistant that understands both
the spoken content and visual content of a video.

Answer the user's question using ONLY the provided context.

The context may contain:
- transcript information
- visual information from video frames
- timestamps for visual observations

Use visual context when the question is about what is visible,
who is visible, what people are doing, objects, scenes, or events
shown in the video.

Use transcript context when the question is about what someone said,
what was discussed, or spoken information.

If both are relevant, combine them.

If the information cannot be found in the provided context, say:
"I could not find this information in the video."

Always be concise and precise.

Context:
{context}""",
            ),
            ("human", "{question}"),
        ]
    )


def build_rag_chain(
    transcript: str,
    visual_context: list = None,
    collection_name: str = None,
):

    vector_store = build_vector_store(
        transcript,
        visual_context=visual_context,
        collection_name=collection_name,
    )

    retriever = get_retriever(
        vector_store,
        k=6,
    )

    llm = get_llm()
    prompt = create_prompt()

    rag_chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain


def load_rag_chain(collection_name: str = None):

    vector_store = load_vector_store(
        collection_name=collection_name
    )

    retriever = get_retriever(
        vector_store,
        k=6,
    )

    llm = get_llm()
    prompt = create_prompt()

    rag_chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain


def ask_question(rag_chain, question: str) -> str:

    print(f"Question: {question}")

    answer = rag_chain.invoke(question)

    print(f"Answer: {answer}")

    return answer