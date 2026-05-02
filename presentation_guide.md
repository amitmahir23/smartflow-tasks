# 🎓 Project Presentation Cheat Sheet

On the day of your presentation, you will likely be starting your computer fresh. Keep this guide open and follow these exact steps to ensure everything runs perfectly for your professor.

> [!IMPORTANT]
> **Prerequisite:** Make sure you have opened **Docker Desktop** and it says "Running".

---

## 🛠️ Step 1: Start Up Your Environment

**1. Start Jenkins**
Open your terminal and run this exact command to start your Jenkins container in the background:
```bash
docker start recursing_gould
```
*(Note: `recursing_gould` is the name Docker automatically gave your Jenkins container. You can also just click the "Play" button next to it inside the Docker Desktop app).*

**2. Give Jenkins Docker Permissions**
Because Jenkins restarted, it needs permission to talk to Docker again. Run this:
```bash
docker exec -u root recursing_gould chmod 666 /var/run/docker.sock
```

**3. Open Port 3000 for your App**
Forward your Kubernetes frontend to port 3000. **Leave this terminal window running** in the background while you present:
```bash
kubectl port-forward svc/frontend-service 3000:3000
```

---

## 🎤 Step 2: The Presentation Script

Now your environment is fully online. You are ready to present!

### Part A: Show the Architecture
1. Open your browser to **[http://localhost:3000](http://localhost:3000)** to show the live application.
2. Open your browser to **[http://localhost:8080](http://localhost:8080)** to show Jenkins.
3. Open your project in **VS Code**.
4. Briefly explain the 3 layers of your project:
   * **MERN Stack**: MongoDB, Express, React (What runs the app)
   * **Docker & Kubernetes**: Packages the app into containers and runs them securely with replicas (High Availability).
   * **Jenkins & Ansible**: The Automation Pipeline (CI/CD) that builds and deploys new code automatically.

### Part B: The Live Demo (The "Wow" Factor)
1. In VS Code, open a file like `src/pages/Index.tsx` and change some text on the screen so it's obvious (e.g., change "Smartflow Tasks" to "Smartflow Tasks - Live Demo").
2. Save the file.
3. Open a **new** terminal tab, commit, and push your changes:
   ```bash
   git add .
   git commit -m "Presentation Live Update"
   git push
   ```

### Part C: The Execution
1. Go to your Jenkins tab (**localhost:8080**).
2. Click **Build Now** on your pipeline.
3. Click the blinking blue circle next to the build to open the **Console Output**.
4. As the logs scroll by, narrate what is happening:
   * *"Jenkins detected my code push and is downloading the latest changes."*
   * *"Now it is using Docker to build a new image of my frontend code."*
   * *"Finally, it is passing the new image to Ansible, which updates the live Kubernetes cluster."*

### Part D: The Finale
1. Wait for the Jenkins console to say **SUCCESS**.
2. Go back to your application tab (**localhost:3000**) and hit **Refresh**.
3. Your new text will instantly appear, proving that the entire automated pipeline works flawlessly!
