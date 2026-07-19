import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Gmail API permission - read-only access to emails
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
]


def get_gmail_service():
    """Initialize and return authenticated Gmail API service."""
    creds = None

    # Try to load saved credentials from previous login
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file(
            "token.json",
            SCOPES
        )

    # If no valid credentials exist, perform OAuth login or refresh
    if not creds or not creds.valid:
        # If credentials exist but expired, refresh them
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        # Otherwise, perform new OAuth flow
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json",
                SCOPES
            )

            creds = flow.run_local_server(port=0)

        # Save the new/refreshed credentials for future use
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    # Build and return the Gmail API service
    service = build(
        "gmail",
        "v1",
        credentials=creds
    )

    return service

if __name__ == "__main__":
    service = get_gmail_service()

    # Get Gmail account profile info
    profile = service.users().getProfile(
        userId="me"
    ).execute()

    print("Profile:",profile)

    # Google Cloud Pub/Sub topic for receiving email notifications
    TOPIC_NAME = "projects/applytrack-502114/topics/MyTopic"

    # Set up Gmail watch to get real-time notifications
    request = {
        "labelIds": ["INBOX"],
        "labelFilterBehavior": "INCLUDE",
        "topicName": TOPIC_NAME,
    }

    response = service.users().watch(
        userId="me",
        body=request
    ).execute()

    print("Watch response:", response)