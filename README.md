# Product-Warehouse-JO

- after downloading/cloning the project run the command ```npm install```.
- database used is ```mysql``` on local machine.
- all routes are restricted except ```users``` routes, you can created, login or delete user without any restriction.
- use the ```login``` route in order to return ```json web token```.
- the ```json web token``` will allow you to access restricted routes products, warehoused and customers just sent it in the header, you can do that in ```POSTMAN``` by passing it as a Bearer token in the authorization tab.
