import { useState } from "react";
import { getUser, logoutUser } from "@/lib/store";
import { User, Project } from "@/lib/types";
import { LoginScreen } from "@/components/LoginScreen";
import { ProjectList } from "@/components/ProjectList";
import { BoardView } from "@/components/BoardView";

const Index = () => {
  const [user, setUser] = useState<User | null>(getUser);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  if (selectedProject) {
    return (
      <BoardView
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <ProjectList
      onSelectProject={setSelectedProject}
      userName={user.name}
      onLogout={() => { logoutUser(); setUser(null); }}
    />
  );
};

export default Index;
