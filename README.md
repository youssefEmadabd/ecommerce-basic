# Getting started

## Requirements

* node
* npm
* mongoDB

## Start Server

First, you have to install dependencies

- `npm i`

Afterwards, you will need to copy the environment variables from .env.example to a new file named `.env`

then start the server using:

- `npm run dev`

# Available endpoints

It is assumed you are running this server locally, thus the domain will be localhost running on port 5000

## Users
- Get `{{base_url}}/v1/users/` with `bearer token` in the headers
- Patch `{{base_url}}/v1/users/` with `bearer token` in the headers
- Delete `{{base_url}}/v1/users/` with `bearer token` in the headers
- Post `{{base_url}}/v1/users/register/:RoleName` with a specified role name in the params (Register Route)
    - Username and password are required in the body
- Post `{{base_url}}/v1/users/login` (login Route)
    - Username and password are required in the body

## Roles

- Get `{{base_url}}/v1/roles/` with `bearer token` in the headers (all users)
- Post `{{base_url}}/v1/roles/` with `bearer token` in the headers
- Patch `{{base_url}}/v1/roles/` with `bearer token` in the headers
- Delete `{{base_url}}/v1/roles/` with `bearer token` in the headers

**Note: only users with admin role can edit roles

## Products

- Get `{{base_url}}/v1/products/` with `bearer token` in the headers (all users)
- Post `{{base_url}}/v1/products/` with `bearer token` in the headers
- Patch `{{base_url}}/v1/products/` with `bearer token` in the headers
- Delete `{{base_url}}/v1/products/` with `bearer token` in the headers

**Note: only users with buyer role can edit roles

## Order

- Get `{{base_url}}/v1/orders/` with `bearer token` in the headers
- Post `{{base_url}}/v1/orders/` with `bearer token` in the headers (admin)
- Patch `{{base_url}}/v1/orders/` with `bearer token` in the headers (admin)
- Delete `{{base_url}}/v1/orders/` with `bearer token` in the headers (admin)
- Post `{{base_url}}/v1/orders/buy` with `bearer token` in the headers (buyer) to start the payment process => payment url
- Post `{{base_url}}/v1/orders/response?success=true` or `{{base_url}}/v1/orders/response?success=false` without `bearer token` since this endpoint is a webhook for stripe (response) 

**Note: The webhook can be secure using hmac.

# Fixtures

Only Roles model has fixtures that persists admin, buyer, and seller roles
