# HackMyDegree
CS 348 Group Project - HackMyDegree

## Getting started
Clone the repo 
```
git clone https://github.com/BBottoml/HackMyDegree.git
```

Install front-end dependencies 
```
cd HackMyDegree 
cd client/ 
npm install
```

Run the front-end 
``` 
npm start
```

Install back-end dependencies 
```
cd ../backend
sudo pip3 -r requirements.txt
```

Run the back-end (not necessary if you're just working on frontend)
```
sudo python3 app.py
```
Remark: Running the app as root on gcp instance will continue to run even after you exit unless you kill the process before exiting. If you exit and don't kill, it will still run. Here's how to kill process upon logging back in: 
```
ps -u root | grep python3 # find the pid 
sudo kill XXXXX
```
