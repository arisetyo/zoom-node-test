# Zoom API - Test server

Integration with Astronaut's scheduling feature

## I. Description

We want to have an API for creating Zoom meeting via Zoom's Open API. By using this new API, when a recruiter create an event with a candidate in the scheduling feature, he/she can also add a Zoom meeting link to the event.

In this example, we have a NodeJS/Express server with three API endpoints. These endpoints access Zoom's Open API. The endpoints are:
```
GET  /info/
GET  /meetings/
POST /meeting/create
```
Detailed description of the endpoints below.

---

## II. How to run the test server

### Create a Zoom app

1. Create a Zoom developer account here. This will be the default administrator account in the integration with Zoom API.

https://marketplace.zoom.us/user/build

In this example, I assume we are using the email account `dev@astrnt.com`. This will also be the host's email in the meeting creation API endpoint.

2. Create a Zoom **JWT** application. Because the application we create is only a backend service, we can opt for JWT authentication process for it.

https://marketplace.zoom.us/develop/create

3. Get the app's credentials; a pair of API key and API secret

4. Fill out the rest of the application's information

### Run the test server

1. Install all the necessary packages.

```
npm install
```

2. Copy the credentials to the `.env` file.

3. Run the server

```
npm start
```

> Note: in this test server, we are using port **3321**

---

## III. How to test the endpoints

Use an API test tool like Postman

### A. Get user information

### `/info/<user email>`

Open `http://localhost:3321/info/<user email>` on Postman with the method `GET`.
You can replace `<user email>` with the Zoom app admin's email or with the string `'me'`.

Example:

`http://localhost:3321/info/dev@astrnt.co`

or

`http://localhost:3321/info/me`

It should return the information of that user's Zoom information.

---

### B. Get user's scheduled meetings

### `/meetings/<user email>`

Open `http://localhost:3321/meetings/<user email>` on Postman with the method `GET`.
You can replace `<user email>` with the Zoom app admin's email or with the string `'me'`.

Example:

`http://localhost:3321/meetings/dev@astrnt.co`

or

`http://localhost:3321/meetings/me`

It should return a list of all the **scheduled** meetings for that user.

---

### C. Create a meeting

### `/meeting/create`

There are four types of meetings we can create using the Zoom API:

Type `1`  : Instant meeting

Type `2`  : Scheduled meeting

Type `3`  : Recurring meeting with no fixed time

Type `8`  : Recurring meeting with fixed time


#### C. 1. Instant meeting

This is the request body for an instant meeting. Send this object as an `x-www-form-urlencoded` data using the `POST` method.
```
{
  topic: 'INTERVIEW: POSITION A',
  agenda: 'A MEETING TO CONDUCT INTERVIEW FOR POSITION A WITH CANDIDATE X',
  type: '1',
  duration: '60',
  timezone: 'Asia/Jakarta',
  password: '123456'
}
```

#### C. 2. Scheduled meeting

When creating a scheduled meeting, we need to include the `start_time` and `schedule_for` in the request's body.
The value of `start_time` is the schedule of the meeting, while `schedule_for` is the owner of the meeting.

This is the request body for a scheduled meeting. Send this object as an `x-www-form-urlencoded` data using the `POST` method.

```
{
  topic: 'INTERVIEW: POSITION B',
  agenda: 'A SCHEDULED MEETING TO CONDUCT INTERVIEW FOR POSITION B WITH CANDIDATE Z',
  type: '2',
  start_time: '2021-03-24T15:15:00Z',
  duration: '60',
  schedule_for: 'dev@astrnt.com',
  timezone: 'Asia/Jakarta',
  password: '123456'
}
```

#### Returned value

If the meeting creation is successful, the `/meeting/create` endpoint will return a result in JSON object format. This data then can be used in the scheduling feature.

Important Zoom meeting information returned by this endpoint that can be used to update a schedule between recruiter and candidate:

`meeting_info.id`
This is the Zoom meeting ID

`meeting_info.join_url`
The join URL that the meeting participants can use to access the Zoom call

`meeting_info.start_time`
If the meeting is a scheduled meeting, this can be synchronized with the schedule

`meeting_info.start_url`
The link to that can be used to start the meeting. In the scheduling feature's case, this is preferably the link we provide to the recruiter.

---

## IV. Test server repository

The test server source code is available here:

https://github.com/arisetyo/zoom-node-test