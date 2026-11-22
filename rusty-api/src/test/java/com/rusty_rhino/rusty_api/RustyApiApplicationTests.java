package com.rusty_rhino.rusty_api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:test;MODE=PostgreSQL",
		"spring.datasource.username=sa",
		"spring.jpa.hibernate.ddl-auto=create-drop"
})
class RustyApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
