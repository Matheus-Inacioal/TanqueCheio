# **App Name**: FuelWise

## Core Features:

- User Authentication: Secure user authentication using Firebase Auth, including email/password login and guest mode. Synchronizes user data with Firestore for logged-in users.
- Vehicle Management: Add, edit, and delete multiple vehicles, specifying details like name, license plate, fuel type, and initial odometer reading. Set a primary vehicle for default usage.
- Fuel Log Recording: Record fuel fill-ups with details such as date, gas station, mileage, cost, price per liter, liters, and fuel type. Automatically calculates fuel consumption and cost per kilometer. Input data validation included.
- Dashboard Overview: Display a summary dashboard showing the latest fuel fill-up, average fuel consumption, monthly spending, and quick actions like adding a new fill-up or viewing reports.
- Reporting and Analytics: Generate reports on overall and fuel-specific consumption, monthly spending (bar graph), and monthly mileage. Allows exporting data to CSV format.
- Maintenance Alerts: Configure maintenance alerts based on mileage (e.g., oil change every 10,000 km). Notifies the user when a vehicle is nearing the target mileage using Firebase Cloud Messaging (FCM).
- Intelligent Alerting: Generates vehicle maintenance notifications. Uses the current odometer readings and the configured maintenance intervals as input tool to send the user maintenance notifications using Firebase Cloud Messaging (FCM)
- Data Synchronization: Implements Firebase extension to keep data synchronized between local Hive storage and Firestore. Monitors document updates in Firestore to trigger FCM notifications.

## Style Guidelines:

- Primary color: Saturated blue (#29ABE2) to represent reliability and efficiency.
- Background color: Light, desaturated blue (#E1F5FE).
- Accent color: Analogous purple (#9C27B0), significantly different in brightness and saturation from the primary color, to add a touch of sophistication and highlight important actions.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Use clean and intuitive icons to represent vehicle stats, fuel types, and maintenance actions. Icons should be consistent with Material 3 design guidelines.
- Responsive layout with clear information hierarchy. Use cards and sections to organize data. Keep key actions easily accessible.
- Subtle transitions and animations for screen navigation, data updates, and user interactions. Use animation to provide feedback and improve the user experience.