package com.ecobazaar.dto.response;

import com.ecobazaar.entity.User;
import com.ecobazaar.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Double ecoScore;
    private String phone;
    private String address;
    private Boolean isActive;

    public static UserResponse fromEntity(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setEcoScore(user.getEcoScore());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setIsActive(user.getIsActive());
        return response;
    }
}
