<?php
require_once 'baseModel.php';

class SupplierModel extends BaseModel {
    protected $table = 'Fournisseur';
    protected $primaryKey = 'idfournisseur';

    public function __construct() {
        parent::__construct($this->table);
    }
}
?>
