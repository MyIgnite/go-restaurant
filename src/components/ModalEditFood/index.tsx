import { useCallback, useRef } from 'react';

import { FormHandles } from '@unform/core';
import { FiCheckSquare } from 'react-icons/fi';

import { Input } from '../Input';
import Modal from '../Modal';
import { Form } from './styles';

interface dataSchema {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface foodSchema {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface ModalEditFoodProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<foodSchema, 'id' | 'available'>) => void;
  editingFood: foodSchema;
}

export function ModalEditFood({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}: ModalEditFoodProps) {
  
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: dataSchema) => {
      handleUpdateFood(data);
      setIsOpen();
    },
    [handleUpdateFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input
          name="image"
          label="URL da imagem"
          placeholder="Cole o link aqui"
        />

        <Input
          name="name"
          label="Nome do prato"
          placeholder="Ex: Moda Italiana"
        />
        <Input name="price" label="Preço" placeholder="Ex: 19.90" />

        <Input
          name="description"
          label="Descrição do prato"
          placeholder="Descrição"
        />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};