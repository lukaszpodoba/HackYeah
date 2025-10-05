from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="zpotson@gmail.com",
    MAIL_PASSWORD="hams kest jctr xntr",  # hasło do aplikacji Gmail
    MAIL_FROM="zpotson@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,      # włączone TLS
    MAIL_SSL_TLS=False,      # zamiast MAIL_SSL
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
