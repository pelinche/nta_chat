Project started 02/03/2021

Project developed using ReactJS, integrated with XMPP Ejabberd server to exchange messages in real time. The implementation includes an administrative area (Admin Area), where it is possible to list the connected users, list the registered users, include, modify, and exclude. It is also possible to register Rooms (MUC), and exclude them. By default, all users are included in all rooms.

In addition to the administrative area, it is possible to log in to the chat, informing username and password. The user's access to the server is unique, that is, if the user is logged in at one location, and logs in at a new location, the first connection will be closed, and the new connection will receive messages.

Project information:
Administrative area

- Obtain information from users
- CRUD users and Chat Rooms
- Obtain Server Status information

Chat Area

- List of registered users (available for conversation)
- List of available rooms (all users are linked by default to all available rooms)
- The user is notified by sound when one receives a new message
- The user is notified with a screen message, just below the user's name that there are new messages for the other user / chat room.

All conversations are individual - it is necessary to select the user / room to see the exchange of messages between the participants.

The functionality that I found important, and that I was able to implement, is to allow a single access per user. In this way, if the user logs in to more than one computer, the previous connection is closed. Another relevant point, was to place a notification by sound (which can be deactivated) to alert the user of the arrival of a new message.

How to run

Clone the project:
git clone https://github.com/pelinche/nta_chat.git

Enter folder nta_chat

Edit file .env to configure the admin credentials, and the API base url and websockect address (Default credentials are defined)

build a docker image

docker build -t nta_chat:dev .

To Run

docker run -it --rm -v /app/node_modules -p 3001:3000 nta_chat:dev
