<?php
    sleep(1);
    $data = Array();
    for($i = 0; $i< 10; $i++) {
        $data[] = Array(
            "name" => "小明".$i,
            "age" => ($i + 10) % 20
        );
    }
    $arr = Array(
        code => 200,
        data => Array(
            "data" => $data,
            "total" => rand(91, 199)
        )
    );
    echo json_encode($arr);
