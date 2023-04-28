package ray1024.weblab3;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Point implements Serializable {
    @Id
    @SequenceGenerator(name = "jpaSequence", sequenceName = "JPA_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "jpaSequence")
    private int id;
    private double x, y, r;
    private String result;

    public void calcResult() {
        if ((x >= -r && x <= 0.0) && (y <= x / 2.0 + r / 2.0) && (y >= -Math.sqrt((r - x) * (r + x))))
            result = "Success";
        else if ((x >= 0.0 && x <= r) && (y <= 0.0 && y >= -r / 2.0)) result = "Success";
        else result = "Fail";
    }

    public String getResult() {
        return result;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }
}
