import { db } from './configs/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const fixProject = async () => {
  try {
    const projectId = '5Fcpu96uofHNqOyBYMOg'; // Marina Golf
    const cityId = 'santiago';

    await updateDoc(doc(db, 'projects', projectId), {
      cityId: cityId
    });
    console.log('Project updated successfully');
    alert('Project fixed!');
  } catch (error) {
    console.error('Error updating project:', error);
    alert('Error fixing project');
  }
};

// We can run this by temporarily importing and calling it in App.tsx or similar,
// OR simpler: user instruction to edit the project.
// But since I can't interact with the console easily, I will create a temporary component.
export default fixProject;
