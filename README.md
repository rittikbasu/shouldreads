# shouldreads

i came across a post on twitter with tons of really good book recommendations in the comments. it was tough to keep track of all the titles, and I wanted to see which books, authors, genres were mentioned the most, which ones were top rated, and which ones people liked the most. So, I compiled all the book recommendations using some data science + ai magic and built this website with advanced search and filtering capabilities to share these great book finds with everyone :)

![formulator](<https://ik.imagekit.io/zwcfsadeijm/shouldreads_PoYX7nXv8.png?updatedAt=1718563866063>)

## features

- **full text search**: find books by title, author, or genre.
- **ai search**: semantically search for books
- **filters**: sort results by top authors, ratings, mentions, likes, comments, and impressions.
- **amazon links**: get direct links to purchase books from amazon in your country.

## tech stack

- **frontend**: Next.js, Tailwind CSS, Aceternity UI
- **backend**: Turso (hosted SQLite DB)
- **search**: OpenAI (for similarity search), Minisearch (for full text search)
- **deployment**: Vercel

## getting started

to get formulator up and running follow these simple steps:

1. clone the repository:
   ```bash
   git clone https://github.com/rittikbasu/shouldreads.git
   ```
2. navigate to the project directory:
   ```bash
   cd shouldreads
   ```
3. install dependencies:
   ```bash
    npm install
   ```
4. fire up the development server and open http://localhost:3000:
   ```bash
    npm run dev
   ```

## contributing

shouldreads is an open-source project, and contributions are welcome so feel free to submit a pull request by following these steps:

1. fork the repository.
2. create a new branch (`git checkout -b feature-branch`).
3. make your changes.
4. commit your changes (`git commit -m 'Add some feature'`).
5. push to the branch (`git push origin feature-branch`).
6. open a pull request.
