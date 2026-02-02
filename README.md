#tech stack ja
////////////////////////////////////////////////////
client 

npm create vite@latest client -- --template react
npm install bootstrap
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install framer-motion
npm install axios
npm install jwt-decode
npm install -D vitest jsdom

////////////////////////////////////////////////////
server

npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
npm install cloudinary multer
npm install --save-dev jest supertest


////////////////////////////////////////////////////
client
.env
VITE_API_URL=http://localhost:5000

server
.env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ktnapi
DB_PORT=3306
JWT_SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=

////////////////////////////////////////////////////
service mail

apiktnwebapp@gmail.com