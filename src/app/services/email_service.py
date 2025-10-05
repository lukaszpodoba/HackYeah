from fastapi_mail import FastMail, MessageSchema
from src.app.core.config import conf
from typing import List


async def send_email(subject: str, recipients: List[str], body: str):
    message = MessageSchema(subject=subject, recipients=recipients, body=body, subtype="html")
    fm = FastMail(conf)
    await fm.send_message(message)
