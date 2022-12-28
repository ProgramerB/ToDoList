# ToDoList

To run this app you require Keycloak to be set up with two clients, one for the backend server and one for the frontend client server

1. Backend keycloak client:
You need to enable client authentication for this work. Update your client_secret on `app.py`
2. Frontend keycloak client:
Don't enable client authentication for this one just update with client_id on `index.js`


This Todo List stores its data as attributes in the keycloak server so you need to setup client scopes to access this data.
There are the attributes you are required to set as the scopes for both the clients:
1. `newList` as a JSON variable, this will store the toDoList data.
2. `paid` as a boolean, this is to check weather user is a premium user or not.
Also enable 'Add to Access Token' for both of these.

You will also require to modify keycloak's database to increase size of the attributes column of user table as the default limit of 255 characters isn't sufficent.

To run the application just run `app.py` and the react-app using `nmp-start`
