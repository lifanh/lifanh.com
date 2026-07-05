---
title: "The Supervisor's Dilemma: Thriving as a Developer in the Age of AI"
description: "How developers can stay effective as their role shifts from writing code to supervising AI."
date: 2026-02-13
tags: ["AI", "Generative AI"]
---

# 1. My Journey from AI User to AI Supervisor

In 2022, GitHub Copilot felt like a superpower. As a software engineer, it was a remarkable “keystroke saver,” handling boilerplate and letting me focus on the architectural puzzles I enjoy. The $10 monthly fee I initially questioned quickly became a rounding error in the face of the productivity gains. I was still the one in control, the one who wrestled with the truly difficult bugs and held the system’s logic in my head.

By 2026, the game had changed. “Vibe coding” became the norm, with AI agents capable of generating entire features from a high-level prompt. The code often looked clean, but this new power brought a new anxiety. If the agent writes the code, what is my role? How can I be sure the code is correct, maintainable, and secure if I didn't write it myself? This is the essence of the **Supervisor's Dilemma**: you cannot verify what you don't understand.

This personal unease led me to a January 2026 paper from Anthropic, *How AI Impacts Skill Formation*, which provided startling data that gave a name to my concerns and a path forward [[1]](#references). This post is my attempt to synthesize that data and offer a practical, data-driven guide for fellow developers on how to not just survive, but thrive, in this new era.

# 2. The Sobering Data: Productivity at the Cost of Competence

The Anthropic study conducted a randomized experiment where developers were tasked with learning a new asynchronous Python library, with one group having AI assistance and a control group without. The results were not what the productivity-first narrative would have us believe.

## The Core Finding: A Significant Drop in Skill

The most striking result was the impact on skill retention. The group using AI assistance scored, on average, **17% lower** on a quiz designed to test their understanding of the library. This is equivalent to a drop of two full letter grades and was statistically significant (p=0.010), indicating it was not a random chance.

| Group | Average Quiz Score (vs. Control) |
| :--- | :--- |
| Control (No AI) | Baseline |
| Treatment (AI-Assisted) | **-17%** |

The study further broke down this skill loss, finding the largest gaps in the most critical areas for a senior engineer:

1.  **Debugging:** The AI-assisted group performed the worst on debugging questions.
2.  **Conceptual Understanding:** A significant gap was also found in their grasp of the library's core principles.
3.  **Code Reading:** The smallest gap was in code reading, likely because both groups were exposed to code.

## The Productivity Paradox: Faster Isn't Always Faster

Contrary to popular belief and other studies focusing on simpler tasks, the AI-assisted group showed **no statistically significant improvement in task completion time**. The reason? A significant portion of their time was reallocated from coding to interacting with the AI.

-   Some participants spent up to **30% of the total task time** just composing prompts.
-   A few participants asked as many as **15 questions** during the 35-minute task.

This reveals a hidden cost: the time saved on typing is often spent on the new, and less practiced, skill of prompt engineering.

# 3. The 'Why': Cognitive Offloading and the Death of Productive Struggle

The data is clear, but *why* does this happen? The paper points to two key mechanisms.

First is **Cognitive Offloading**. The AI acts like an exoskeleton for the mind; you feel powerful while using it, but the moment it's removed, the underlying weakness is exposed. The study found that lower-performing participants would simply paste error messages back to the AI, asking for a fix without ever engaging in the diagnostic process themselves.

This leads to the second mechanism: the elimination of **Productive Struggle**. The control group, without AI, encountered more errors. While frustrating in the moment, these errors forced them to engage with the library's documentation, form hypotheses, and test them. This struggle is not a bug in the learning process; it *is* the learning process. It's how we build robust mental models. The AI-assisted group, by contrast, experienced a smoother, “seemingly bug-free” development process, but at the cost of deep learning.

# 4. From Data to Action: Three Personas for Thriving with AI

The study didn't just highlight the problem; it pointed to a solution. By analyzing the behavior of the participants, they identified distinct patterns of AI interaction. The highest-scoring participants, who learned just as much as the control group, adopted a set of behaviors we can all learn from. I've framed these as three personas to adopt in your daily work.

## Persona 1: The Conceptual Inquirer

This persona resists the urge to ask the AI to *do* something and instead focuses on asking it to *explain* something. They treat the AI less like a junior developer and more like a Socratic partner.

*   **Instead of:** "Write a function to connect to the database and fetch user data."
*   **Try:** "What are the trade-offs between using a connection pool versus opening a new connection for each request in this library? Explain the lifecycle of a connection object."

The highest-scoring participants in the study asked more conceptual questions and fewer code-generation questions. This approach keeps you in the driver's seat, using the AI to build your mental model, which you then use to write the code yourself.

## Persona 2: The Forced Comprehender

This persona recognizes that sometimes, you just need the code. But they never treat that code as a black box. They follow a strict, two-step process: **Generate, then Comprehend.**

1.  **Generate:** Let the AI produce the code snippet, the function, or even the whole class.
2.  **Comprehend:** Before moving on, you *must* prove to yourself that you understand it. Explain the code back to the AI. Write comments for every non-obvious line. Trace the execution path with a novel input. The goal is to force the generated code into your own mental model before you accept it.

This practice directly counteracts cognitive offloading. It turns a passive act of copying and pasting into an active learning exercise.

## Persona 3: The Deliberate Debugger

When an error occurs, the temptation is to immediately paste it into the AI and ask for a fix. The Deliberate Debugger resists this. They see an error not as a roadblock, but as a learning opportunity.

*   **Step 1: Hypothesize.** Before going to the AI, form a hypothesis. "I think this is a `NoneType` error because the API call is failing silently under certain conditions."
*   **Step 2: Inquire.** Now, use the AI to test your hypothesis. "Could you explain the circumstances under which this function might return `None`? What's the idiomatic way to handle that in this library?"
*   **Step 3: Implement.** Use the AI's explanation to write the fix yourself.

This transforms debugging from a frustrating chore into a scientific process of inquiry and validation, directly targeting the skill that atrophied most in the study.

# 5. The Future is Supervision

The data is clear: a passive reliance on AI, while tempting, will erode the very skills that make us valuable as senior engineers. The future of our profession lies not in writing code, but in our ability to direct, verify, and supervise its creation. By consciously adopting the personas of the Conceptual Inquirer, the Forced Comprehender, and the Deliberate Debugger, we can harness the incredible power of AI not just to be more productive, but to become more competent, knowledgeable, and ultimately, more valuable engineers.

---

# References

[1] Shen, J. H., & Tamkin, A. (2026, January). *How AI Impacts Skill Formation*. arXiv. Retrieved from [https://arxiv.org/abs/2601.20245v1](https://arxiv.org/abs/2601.20245v1)
