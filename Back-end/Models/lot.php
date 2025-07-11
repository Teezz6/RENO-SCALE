<?php
require_once 'baseModel.php';

class LotModel extends BaseModel {
    protected $table = 'Lot';
    protected $primaryKey = 'idlot';

    public function __construct() {
        parent::__construct($this->table);
    }
}
?>
