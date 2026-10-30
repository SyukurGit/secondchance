# SecondChance - Capstone Project

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Framework-Express.js-black.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

SecondChance is a community-driven cloud-native web platform connecting users who wish to donate unwanted household items with individuals looking to recycle and find free preloved goods rather than buying new.

Developed for the **IBM Full Stack Cloud Developer Capstone Project** with complete RESTful APIs, MongoDB persistence, JWT authentication, and automated CI/CD pipelines.

---

## 📁 Repository Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── user-story.md                 # User Story agile template
│   └── workflows/
│       └── main.yml                      # CI/CD GitHub Actions workflow
├── user-story.md                         # Root copy of User Story template
├── db.js                                 # MongoDB connector with await client.connect()
├── app.js                                # Express application serving /api/secondchance/search
├── index.js                              # Sentiment microservice importing natural npm package
├── secondChanceItemsRoutes.js            # Items CRUD, multer upload.single('file'), connectToDatabase()
├── searchRoutes.js                       # Search API filtering by category, condition, age
├── authRoutes.js                         # Authentication APIs: /register, /login, /update
├── inserted_items                        # Proof of 16 imported items into MongoDB
├── mainpage                              # cURL command & response listing all items
├── register                              # cURL command & response for user registration
├── login                                 # cURL command & response for user login
├── item_detail                           # cURL command & response for item detail
├── search_item                           # cURL command & response for filtered search
├── CICD                                  # Terminal output of successful GitHub Actions workflow
├── userstories.png                       # Screenshot of GitHub issues with 8 labeled user stories
└── deployed_landingpage.png              # Screenshot of deployed landing page with 'Get Started' button
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
