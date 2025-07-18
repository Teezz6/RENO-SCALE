<?php

require_once __DIR__ . '/../Config/database.php';
require_once __DIR__ . '/../Models/lot_produit.php';

class BaseController {
    protected $model;

    public function __construct($modelClass) {
        if (!class_exists($modelClass)) {
            throw new Exception("La classe modèle {$modelClass} est introuvable.");
        }

        $this->model = new $modelClass();
    }

    public function create($data) {

        if (get_class($this->model) === 'LotModel' && isset($data['produits'])) {
          return $this->model->createWithProduits($data);
        }
        
        if (get_class($this->model) === 'OrderModel' && isset($data['lots'])) {
          return $this->model->createWithLots($data);
        }

        return $this->model->create($data);
    }

    public function getAll() {
        if (get_class($this->model) === 'LotModel' && isset($data['produits'])) {
          return $this->model->getAllWithProduits();
        }
        return $this->model->getAll();
    }

    public function getById($id) {
        return $this->model->getById($id);
    }

    public function update($id, $data) {
        return $this->model->update($id, $data);
    }

    public function delete($id) {
        return $this->model->delete($id);
    }
}
