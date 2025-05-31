<?php
require_once 'baseModel.php';

class OrderModel extends BaseModel {
    protected $table = 'Commande';
    protected $primaryKey = 'idcommande';

    public function __construct() {
        parent::__construct($this->table);
    }
}
?>
