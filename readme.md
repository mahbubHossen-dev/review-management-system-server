
# Service Review Application System

The Service Review System is a comprehensive backend application built using Node.js, Express.js, and MongoDB. This system enables users to manage services and reviews efficiently, offering a secure and user-friendly experience. With features like JWT-based authentication, token management, and CRUD operations for services and reviews, the system is ideal for building a service-oriented platform where users can create, review, and manage their content






## Live

https://reviewsystem-dfd5c.web.app/


## Key Features

### Authentication & Authorization

- JWT Authentication: Secure user authentication with JSON Web Tokens.

- Cookie-Based Authentication: Uses cookies for managing session tokens with httpOnly and secure settings.

- Protected Routes: Sensitive operations like posting and editing services/reviews are protected with token-based middleware.

- Service Management

- Add Services: Allows authorized users to add new services.

- View Services:

- Retrieve all services or filter by category.

- Fetch a limited number of services (e.g., 6 for homepage).

- Fetch details of a specific service by its ID.

- Update Services: Edit service details using a PUT request.

- Delete Services: Remove specific services securely.

- Review Management

- Add Reviews: Users can submit reviews for services.

### Get Reviews:

- Retrieve all reviews for a specific service by its ID.

- Fetch all reviews associated with a user account (email-based).

- Edit Reviews: Update review content, including rating and description.

- Delete Reviews: Remove specific reviews securely.

### Security Features

- Middleware Validation: Protect routes with verifyToken middleware to ensure only authorized users can access sensitive endpoints.

- Environment Variables: Store sensitive credentials like database user and password in .env.

- CORS Configuration: Restrict origins to trusted domains with cross-origin credentials enabled.


## 🛠 Skills
Technologies Used

Frontend:

React: For building the user interface.

Tailwind CSS: For styling the application.

daisyUI: For ready-made UI components.

Framer Motion: For animations.

### NPM package
-  React Icons
- React CountUp
- react-datepicker
- react-toastify
- sweetalert2
- swiper
