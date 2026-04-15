import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateBcryptPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password";
        
        for (int i = 0; i < 3; i++) {
            String hash = encoder.encode(password);
            System.out.println("Hash " + (i+1) + ": " + hash);
            System.out.println("Matches: " + encoder.matches(password, hash));
            System.out.println();
        }
    }
}
