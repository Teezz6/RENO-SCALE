<?php
require_once 'baseModel.php';

class DeliveryModel extends BaseModel {
    protected $table = 'Livraison';
    protected $primaryKey = 'idlivraison';

    public function __construct() {
        parent::__construct($this->table);
    }
}
?>
