# Reflection on AI Agent Usage

During the development of the FuelEU Maritime compliance dashboard, I extensively used AI agents to accelerate coding, refactoring, and problem-solving tasks.

## What I Learned

Using AI agents helped me understand how to leverage automation without compromising code quality. I learned how to critically evaluate AI-generated suggestions, especially for TypeScript and Prisma, where type safety is crucial. I also improved my ability to debug and correct AI-suggested logic when it did not fully align with domain requirements.

## Efficiency Gains

AI agents like ChatGPT and GitHub Copilot significantly reduced the time required to:

- Set up boilerplate for React components and TailwindCSS styling.  
- Generate Express routes, middleware, and Prisma client calls.  
- Implement domain logic such as banking, pooling, and comparison calculations.  
- Refactor code for cleaner architecture following the hexagonal pattern.  

Overall, tasks that would normally take several hours were completed in a fraction of the time.

## Challenges and Corrections

While AI agents were helpful, they occasionally:

- Suggested incorrect Prisma syntax or incomplete database queries.  
- Generated React hooks or API calls without proper error handling.  
- Ignored TypeScript strict mode checks, leading to `any` type usage.  

To address this, I manually reviewed and corrected each AI-generated snippet, ensuring correctness, type safety, and adherence to the project’s architectural principles.

## Improvements for Next Time

In future projects, I would:

- Use AI agents more strategically for repetitive tasks and documentation rather than core business logic.  
- Integrate automated testing suggestions from AI agents to improve reliability.  
- Maintain a clear workflow for validating AI outputs, especially for complex domain calculations.  

## Conclusion

AI agents were instrumental in accelerating development and reducing boilerplate work. However, human oversight remained critical for correctness, type safety, and architectural adherence. The combination of AI assistance and careful manual validation allowed me to efficiently deliver a clean and functional full-stack application.
