import { useEffect, useState } from 'react';
import { Food } from '../../components/Food';
import { Header } from '../../components/Header';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import api from '../../services/api';

import { FoodsContainer } from './styles';

interface foodSchema {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

type foodType = Omit<foodSchema, 'id' | 'available'>

export function Dashboard() {
  const [foods, setFoods] = useState<foodSchema[]>([]);
  const [editingFood, setEditingFood] = useState<foodSchema>({} as foodSchema);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  console.log('foods', foods)

  useEffect(() => {
    async function loadFoods() {
      api
        .get('/foods')
        .then(response => setFoods(response.data))
        .catch(error => console.log(error))
    }

    loadFoods();
  }, []);

  function notConpletedForm(food: foodType) {
    const { name, price, image, description } = food;
    const notConpletedForm = !name || !price || !image || !description
    return notConpletedForm
  }

  async function handleAddFood(food: foodType){
    try {
      if (notConpletedForm(food)) {
        console.log('Todos os campos são obrigatórios')
        return
      }

      const res = await api.post('/foods', { ...food, available: true });

      setFoods([...foods, res.data]);
      
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: foodType) {
    try {
      if (notConpletedForm(food)) {
        console.log('Todos os campos são obrigatórios')
        return
      }

      const { id, available } = editingFood;
      const editedData = { ...food, id, available };
      const { data } = await api.put(`/foods/${id}`, editedData);

      const updatedList = foods.map(plate => (plate.id === id ? data : plate));
      setFoods(updatedList);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      // Enable if project runs locally
      // await api.delete(`/foods/${id}`);
      setFoods(foods.filter(food => food.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: foodSchema) {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};