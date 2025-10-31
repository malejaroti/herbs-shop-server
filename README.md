# 🌿 Herbs Shop Server
A Node.js/Express backend server for an e-commerce herbs and spices shop, built with TypeScript, Prisma, and PostgreSQL.
## 🧩 Project Context

This backend was developed as part of the final project for a complementary module of the Web Devoplment bootcamp offered by Ironhack.  
It was built within a few days to demonstrate proficiency with **TypeScript**, **PostgreSQL**, and **Prisma**.

The database is deployed on **Supabase** (PostgreSQL), and the backend follows a **cloud-friendly architecture**, using environment variables, external storage (Cloudinary), and a stateless JWT authentication system.

Although the app is not a full e-commerce platform yet (no shopping cart or payment integration),  
it implements key backend concepts such as:
- User authentication and role-based access (JWT)
- Product and variant management
- Image upload and database seeding
- Full CRUD operations with Prisma

The project was designed with scalability in mind and could easily be extended to include  
features like a checkout flow, order management, and Stripe integration.



## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin/Customer)
- **Product Management**: Full CRUD operations for herbs and spices with variants
- **Image Upload**: Cloudinary integration for product images
- **Database**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Admin Panel**: Protected admin routes for inventory management
- **Public Shop API**: Customer-facing product browsing endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd herbs-shop-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5005
   ORIGIN=http://localhost:5173
   DATABASE_URL=postgresql://username:password@host:port/database
   TOKEN_SECRET=your-jwt-secret-key
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   ```

4. **Database Setup**
   ```bash
   # Run Prisma migrations
   npm run prisma
   
   # Seed the database with initial data
   npx prisma db seed
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:5005` with hot reloading.

### Production Mode
```bash
npm start
```

## 📊 Database Schema

### User Model
- `id`: Unique identifier (CUID)
- `firstName`, `lastName`: User name
- `email`: Unique email address
- `password`: Hashed password
- `role`: ADMIN or CUSTOMER
- Timestamps: `createdAt`, `updatedAt`

### Product Model
- `id`: Unique identifier (CUID)
- `name`: Product name
- `slug`: URL-friendly identifier
- `latinName`: Scientific name (optional)
- `bulkGrams`: Available bulk quantity
- `reorderAtGrams`: Reorder threshold
- `descriptionMd`: Markdown description
- `originCountry`: Country of origin
- `organicCert`: Organic certification
- `categories`: Array of HERBS or SPICES
- `images`: JSON array of image objects
- `active`: Visibility status
- `variants`: Related product variants

### ProductVariant Model
- `id`: Unique identifier (CUID)
- `sku`: Stock keeping unit
- `name`: Variant name (e.g., "100g", "Powder")
- `packSizeGrams`: Package size
- `price`: Decimal price
- `currency`: EUR (default)
- `taxClass`: STANDARD, REDUCED, or EXEMPT
- `active`: Availability status

## 🛣️ API Endpoints

### Public Endpoints
- `GET /api/` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/shop/products` - Browse products (customer view)

### Protected Admin Endpoints
*Requires Bearer token with ADMIN role*

- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/upload` - Upload product images

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Commands

```bash
# Apply pending migrations
npm run prisma

# Reset database and apply all migrations
npx prisma migrate reset

# Seed database with sample data
npx prisma db seed

# View database in Prisma Studio
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

## 🧪 Data Seeding

The project includes comprehensive seed data:
- **Sample products**: Various herbs and spices with multiple variants
- **Product variants**: Different package sizes and formats

Run the seed script:
```bash
npx prisma db seed
```

## 📁 Project Structure

```
src/
├── config/           # Server configuration
├── db/              # Database connection
├── error-handling/  # Centralized error handling
├── generated/       # Prisma generated client
├── middleware/      # Authentication & validation middleware
├── routes/          # API route handlers
├── types/           # TypeScript type definitions
├── zodSchemas/      # Zod validation schemas
└── server.ts        # Application entry point

prisma/
├── migrations/      # Database migration files
├── schema.prisma    # Database schema
├── seed.ts         # Database seeding script
└── *.json          # Seed data files
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5005` |
| `ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `TOKEN_SECRET` | JWT signing secret | `your-secret-key` |
| `CLOUDINARY_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_SECRET` | Cloudinary API secret | `your-secret` |

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run prisma` | Run Prisma migrations |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please contact me. (@malejaroti)

---

*Built with ❤️ for herbs and spices enthusiasts*