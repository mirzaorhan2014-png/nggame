# Contributing to NGGames 🎮

Thank you for your interest in contributing to NGGames! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Testing](#testing)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/nggame.git
   cd nggame
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/mirzaorhan2014-png/nggame.git
   ```

## Development Setup

Follow the setup instructions in [README.md](README.md):

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Create .env file
cp .env.example .env

# Start development servers
npm run dev
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution**
- **Alternative solutions** you've considered
- **Mockups or examples** (if applicable)

### Areas for Contribution

We especially welcome contributions in these areas:

#### 🎮 Game Development
- Implement the 20 built-in games
- Create new game types
- Improve game graphics and animations
- Add bot AI for single-player modes
- Optimize game performance

#### 🤖 AI Game Engine
- Integrate OpenAI API
- Implement game generation logic
- Create template system
- Add code validation
- Improve AI prompts

#### 🎨 UI/UX Improvements
- Enhance glassmorphism effects
- Create new animations
- Improve mobile responsiveness
- Add accessibility features
- Design new components

#### 🔧 Backend Features
- Add more API endpoints
- Improve database queries
- Enhance real-time features
- Add caching system
- Implement rate limiting improvements

#### 📝 Documentation
- Improve API documentation
- Add code comments
- Create tutorials
- Write guides
- Translate documentation

#### 🧪 Testing
- Write unit tests
- Add integration tests
- Create E2E tests
- Test on different browsers
- Performance testing

## Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow coding standards
   - Write meaningful commit messages
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Adding tests
   - `chore:` - Maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Related Issues**: Link any related issues
   - **Screenshots**: If UI changes were made
   - **Testing**: How you tested the changes

5. Wait for review and address feedback

### PR Review Process

- PRs require at least one approval
- All CI checks must pass
- Code must follow project standards
- Documentation must be updated if needed
- No merge conflicts

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add JSDoc comments for functions

```javascript
/**
 * Calculate user's win rate percentage
 * @param {number} wins - Total wins
 * @param {number} totalMatches - Total matches played
 * @returns {string} Win rate percentage
 */
function calculateWinRate(wins, totalMatches) {
  if (totalMatches === 0) return '0.00';
  return ((wins / totalMatches) * 100).toFixed(2);
}
```

### CSS

- Use CSS custom properties (variables)
- Follow BEM naming convention when applicable
- Keep specificity low
- Use mobile-first approach
- Comment complex styles

### Node.js/Express

- Use async/await over promises
- Handle errors properly
- Validate input
- Use middleware appropriately
- Follow REST API conventions

```javascript
// Good
router.get('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

### File Organization

- Keep files focused and small
- Use descriptive file names
- Group related files together
- Follow established patterns

### Naming Conventions

- **Components**: PascalCase (`UserProfile.jsx`)
- **Functions**: camelCase (`getUserProfile()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PLAYERS`)
- **Files**: kebab-case for utilities (`api-client.js`)
- **CSS Classes**: kebab-case (`.user-profile-card`)

## Project Structure

```
nggame/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── games/        # Game implementations
│   │   ├── store/        # State management
│   │   ├── utils/        # Helper functions
│   │   └── styles/       # Global styles
│   └── public/       # Static assets
├── server/          # Node.js backend
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware
│   ├── socket/      # Socket.io handlers
│   └── utils/       # Helper functions
└── docs/            # Documentation
```

## Testing

### Running Tests

```bash
# Backend tests
npm test

# Frontend tests
cd client && npm test

# E2E tests
npm run test:e2e
```

### Writing Tests

- Write tests for new features
- Maintain existing test coverage
- Use descriptive test names
- Test edge cases

```javascript
// Example test
describe('User Authentication', () => {
  it('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      country: 'United States'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe('testuser');
  });
});
```

## Development Tips

### Debugging

- Use browser DevTools for frontend
- Use Node.js debugger for backend
- Check console logs
- Use React DevTools
- Monitor network requests

### Hot Reload

The development setup includes hot reload:
- Frontend: Vite HMR
- Backend: Nodemon

### Database Changes

If you modify database models:
1. Document the changes
2. Consider migration scripts
3. Update related API endpoints
4. Test thoroughly

### Socket.io Development

Test real-time features:
1. Open multiple browser tabs
2. Use Socket.io client in DevTools
3. Check connection status
4. Monitor emitted events

## Questions?

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Create an Issue
- **Security concerns**: Email maintainers privately
- **Feature requests**: Create an Issue with [Feature Request] tag

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

Thank you for contributing to NGGames! 🎮🏆

---

**Happy Coding!** 🚀