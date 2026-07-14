import json

from google.cloud import pubsub_v1


PROJECT_ID = "applytrack-502114"
SUBSCRIPTION_ID = "MySub"


# Create Pub/Sub subscriber client
subscriber = pubsub_v1.SubscriberClient()


# Build the full subscription resource path
subscription_path = subscriber.subscription_path(
    PROJECT_ID,
    SUBSCRIPTION_ID
)


def handle_message(message):
    try:
        print("\nMessage received")

        # Pub/Sub gives data as bytes
        raw_data = message.data

        print("Raw data:", raw_data)


        # bytes -> string
        decoded_data = raw_data.decode("utf-8")

        print("Decoded data:", decoded_data)


        # JSON string -> Python dictionary
        notification = json.loads(decoded_data)

        print("Notification:", notification)


        # Extract Gmail notification data
        email_address = notification["emailAddress"]
        history_id = notification["historyId"]

        print("Email:", email_address)
        print("History ID:", history_id)


        # Successfully processed
        message.ack()

        print("Message ACKed")


    except Exception as error:

        print("Error:", error)

        # Processing failed
        message.nack()


# Start listening to the subscription
streaming_pull_future = subscriber.subscribe(
    subscription_path,
    callback=handle_message
)


print(f"Listening on {subscription_path}")


try:
    # Keep the main program running
    streaming_pull_future.result()

except KeyboardInterrupt:

    print("\nStopping subscriber...")

    streaming_pull_future.cancel()

    streaming_pull_future.result()