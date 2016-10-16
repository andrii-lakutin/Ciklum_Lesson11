#ANGULAR APP

Clone -> npm i -> npm run server / npm run dev

#Authentication: login - admin, pass - admin

Features:

1. Authentication by Passport(Basic Auth); 
2. Search algoritm: 
Movie exist in our DB? - return it to user;
No? - go to another api, add it to our DB, return it to user from our DB;
3. Two users: Anonymus user(default) and admin.
4. Each user has his own favorite list. If you login as admin you will see admin favorite movies only. You can refresh page, this will return you to "Anonymus user", and you will see anonymus user favorite movies.
5. When you login as admin - your nickname in chat will change to "admin".
6. DB - mLab.