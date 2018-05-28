#!/bin/bash

sudo iptables -t nat -F

sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 3001 -m statistic --mode nth --every 4 --packet 0 -j REDIRECT --to-ports 3002
sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 3001 -m statistic --mode nth --every 3 --packet 0 -j REDIRECT --to-ports 3003
sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 3001 -m statistic --mode nth --every 2 --packet 0 -j REDIRECT --to-ports 3004
sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 3001 -j REDIRECT --to-ports 3005

sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 9000 -m statistic --mode nth --every 4 --packet 0 -j REDIRECT --to-ports 9002
sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 9000 -m statistic --mode nth --every 3 --packet 0 -j REDIRECT --to-ports 9003
sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 9000 -m statistic --mode nth --every 2 --packet 0 -j REDIRECT --to-ports 9004
sudo iptables -t nat -A PREROUTING -p tcp -m tcp --dport 9000 -j REDIRECT --to-ports 9005

nohup node index.js 3002 9002 &
nohup node index.js 3003 9003 &
nohup node index.js 3004 9004 &
nohup node index.js 3005 9005 &