<?php
require_once 'baseModel.php';

class ProduitModel extends BaseModel {
    protected $table = 'Produit';
    protected $primaryKey = 'idproduit';

    public function __construct() {
        parent::__construct($this->table);
    }
}
?>
