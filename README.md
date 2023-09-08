# Flight Search Application

This project is a frontend application developed to simulate flight ticket search functionality.

## Features

### Search Functionality
- Users can search flights by selecting:
  - Departure airport
  - Arrival airport
  - Departure date
  - Return date
- An option to select "One-way trip". If this is selected, the return date becomes unavailable.
- Input areas are validated before sending a request to mock API.
- Dynamic airport search:
  - As users type in the departure and arrival input boxes, the application searches for matching airports by city or code, displaying relevant results.
- A datepicker is incorporated for selecting the departure and return dates.


### Flight Listing
- Displays a list of available flights based on the search criteria.
- Flights can be sorted by:
  - Departure time
  - Return time
  - Flight duration
  - Price
- A "loading" animation is shown while waiting for server responses.
- Flight details are displayed including the airline, city, etc.
- In-built error handling to manage any errors arising from the server.
- **Mock Data**: The frontend communicates with a mock API using mock data for simulating all requests and responses.
- Handled potential cases where the server might return empty data.

## Tech Stack
- ❤️ The application is built using Svelte.
- 💪 TypeScript has been employed to ensure type safety and better code management.
- 🚀 For version control, Git has been utilized and the project is hosted on GitHub.

## Getting Started

1. Clone the repo or see it in action at [https://mockflights.vercel.app/]

## Feedback

For any feedback or issues related to this project, please reach out to [cagdaskemik@gmail.com](cagdaskemik@gmail.com).

---

