<?php

require_once __DIR__ . '/../config/database.php';

class BaseController {
    protected $model;

    public function __construct($modelClass) {
        if (!class_exists($modelClass)) {
            throw new Exception("La classe modèle {$modelClass} est introuvable.");
        }

        $this->model = new $modelClass();
    }

    public function create($data) {
        return $this->model->create($data);
    }

    public function getAll() {
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
