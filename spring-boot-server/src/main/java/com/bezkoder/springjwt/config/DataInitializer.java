package com.bezkoder.springjwt.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public void run(String... args) throws Exception {
		// Initialize roles if they don't exist
		if (roleRepository.count() == 0) {
			roleRepository.save(new Role(ERole.ROLE_USER));
			roleRepository.save(new Role(ERole.ROLE_MODERATOR));
			roleRepository.save(new Role(ERole.ROLE_ADMIN));
			System.out.println("Roles initialized successfully!");
		}
	}
}
