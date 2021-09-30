package com.example.mySpringProject.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


// Import log4j classes.
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;


@RestController
public class HelloController {

  private static final Logger logger = LogManager.getLogger();




  @GetMapping("/helloworld")
  public String helloWorld() {
    return "Hello World!";
  }

  @GetMapping("user/purchcase")
  public String purcahse() {
    logger.entry();
    logger.error("user." + x + "purchased .");
    logger.exit();
  }

  @GetMapping("/log")
  public void logHelloWorld(){
    logger.entry();
    logger.error("Hello beautiful world.");
    logger.exit();

  }
}
