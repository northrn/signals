# Signals

A modern AI news and discussion platform built with Next.js, TypeScript, and Supabase.

## Features

- 🤖 **AI-focused content**: Share and discover the latest AI developments
- 👥 **User submissions**: Community-driven content with admin approval
- 🔐 **Admin moderation**: Approval workflow for user-generated content
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- ⚡ **Real-time updates**: Live voting and engagement features
- 🔒 **Secure authentication**: Powered by Supabase Auth

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd signals
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Run the SQL schema from `database.sql` in your Supabase SQL editor
   - This creates tables, policies, and triggers for the approval system

5. Create an admin user:
   - Sign up through the app
   - Update your profile in Supabase: `UPDATE profiles SET is_admin = true WHERE id = 'your-user-id'`

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── AdminPanel.tsx     # Admin moderation interface
│   ├── PostCard.tsx       # Post display component
│   ├── PostFeed.tsx       # Main content feed
│   ├── PostSubmissionForm.tsx # User submission form
│   ├── UserAvatar.tsx     # User profile dropdown
│   └── Header.tsx         # Navigation header
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Dark/light mode
└── utils/                 # Utilities
    └── supabase.ts        # Supabase client
```

## Database Schema

The app uses a PostgreSQL database with the following main tables:

- **profiles**: User information and admin status
- **posts**: Content submissions with approval workflow
- **votes**: User voting on posts
- **comments**: Post discussions (future feature)

## Admin Features

- **Auto-approval**: Admin posts go live immediately
- **Moderation queue**: Review and approve/reject user submissions
- **Admin dashboard**: Dedicated interface at `/admin`
- **User management**: Control admin privileges

## User Workflow

1. **Sign up/Sign in**: Create account or log in
2. **Submit content**: Share AI news and developments
3. **Pending review**: Submissions await admin approval
4. **Go live**: Approved posts appear in the main feed
5. **Engage**: Vote and comment on approved content

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions, please open an issue on GitHub.
