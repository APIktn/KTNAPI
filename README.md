#tech stack naja
////////////////////////////////////////////////////
client 
npm run dev
clienttest 
npx vitest
clientcheck 
npx vitest --coverage

clientdocker 
docker build -t client-app .
docker run -p 5174:5173 client-app

npm create vite@latest client -- --template react
npm install bootstrap
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install framer-motion
npm install axios
npm install jwt-decode
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D jsdom@22.1.0
npm install -D @vitest/coverage-v8
npm install @vitejs/plugin-basic-ssl -D

////////////////////////////////////////////////////
server 
npm run start
servertest
npm run test
servercheck 
npx vitest --coverage

serverdocker
docker build -t server-app .
docker run -p 5001:5000 server-app

npm init -y
npm install express cors dotenv
npm install cookie-parser
npm install --save-dev nodemon
npm install selfsigned
npm install cloudinary multer
npm install -D vitest
npm install -D @vitest/coverage-v8

////////////////////////////////////////////////////
CI/CD test

step 1 ci test
npx vitest run

step 2 cd build docker
step 3 cd run docker
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
cloudianary

Home/bone_chop

/profile
/product

////////////////////////////////////////////////////
pin vitest for ci
npm audit fix --omit=dev

////////////////////////////////////////////////////
git hook
post-merge
#!/bin/sh

echo "📦 running npm install (client)..."
if [ -d "client" ]; then
  cd client || exit 1
  npm install
  cd ..
else
  echo "⚠️ client folder not found"
fi

echo "📦 running npm install (server)..."
if [ -d "server" ]; then
  cd server || exit 1
  npm install
  cd ..
else
  echo "⚠️ server folder not found"
fi

echo "✅ post-merge hook done"
