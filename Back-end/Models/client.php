<?php
require_once 'baseModel.php';

class ClientModel extends BaseModel {
    protected $table = 'Client';
    protected $primaryKey = 'idclient';

    public function __construct() {
        parent::__construct($this->table);
    }
}
?>
