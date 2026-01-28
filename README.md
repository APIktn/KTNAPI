#tech stack ja

client 
.env
VITE_API_URL=http://localhost:5000

npm create vite@latest client -- --template react
npm install bootstrap
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @dnd-kit/core
npm install framer-motion
npm install axios
npm install jwt-decode

////////////////////////////////////////////////////
server
.env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ktnapi
DB_PORT=3306


npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
