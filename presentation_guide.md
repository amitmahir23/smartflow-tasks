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

**3. Start the Webhook Tunnel (ngrok)**
Open a **new** terminal window and run this command to expose Jenkins to the internet so GitHub can trigger it automatically. **Leave this running**:
```bash
ngrok http 8080
```
*(Note: Ensure the ngrok URL matches what is saved in your GitHub Repository -> Settings -> Webhooks. If the ngrok URL changed because you restarted it, update it in GitHub before you present!)*

**4. Open the App and Monitoring Ports**
Open a **new** terminal window and forward your Kubernetes frontend to port 3000. **Leave this running**:
```bash
kubectl port-forward svc/frontend-service 3000:3000
```

Open a **new** terminal window and forward your Grafana monitoring dashboard to port 3001. **Leave this running**:
```bash
kubectl port-forward svc/grafana-service 3001:3001
```

---

## 🎤 Step 2: The Presentation Script

Now your environment is fully online. You are ready to present!

### Part A: Show the Architecture
1. Open your browser to **[http://localhost:3000](http://localhost:3000)** to show the live application.
2. Open your browser to **[http://localhost:3001](http://localhost:3001)** to show the Grafana Monitoring Dashboard. Log in (admin/admin) and open the "Prometheus System Performance (Live)" dashboard.
3. Open your browser to **[http://localhost:8080](http://localhost:8080)** to show Jenkins.
4. Briefly explain the architecture layers:
   * **MERN Stack**: MongoDB, Express, React (The Application)
   * **Docker & Kubernetes**: Packages the app and runs it securely with self-healing and replication.
   * **Prometheus & Grafana**: Infrastructure-as-Code monitoring stack for real-time observability.
   * **Jenkins & Ansible**: A fully automated CI/CD pipeline triggered by GitHub webhooks.

### Part B: The Live Demo (The "Wow" Factor)
1. In VS Code, open a file like `src/pages/Index.tsx` and change some text on the screen so it's obvious (e.g., change "Smartflow Tasks" to "Smartflow Tasks - Live Demo").
2. Save the file.
3. Open a terminal tab, commit, and push your changes:
   ```bash
   git add .
   git commit -m "Presentation Live Update"
   git push origin main
   ```

### Part C: The Execution
1. Go to your Jenkins tab (**localhost:8080**). You don't need to click anything!
2. Tell the professor: *"Because of the GitHub Webhook, Jenkins instantly detected the push and has automatically started building."*
3. Click the blinking blue circle next to the build to open the **Console Output**.
4. As the logs scroll by, narrate what is happening:
   * *"It is downloading the latest changes."*
   * *"It is using Docker to build a new image of the application."*
   * *"Finally, it passes the new image to Ansible, which updates the live Kubernetes cluster."*

### Part D: The Finale
1. Wait for the Jenkins console to say **SUCCESS**.
2. Go back to your application tab (**localhost:3000**) and hit **Refresh**.
3. Your new text will instantly appear, proving the pipeline works flawlessly!
4. Switch to your **Grafana** tab (**localhost:3001**) to show that the system remained stable during the deployment, pointing out the live CPU spikes and active system metrics on the dashboard.
