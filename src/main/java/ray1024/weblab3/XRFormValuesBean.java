package ray1024.weblab3;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import java.util.List;

@ManagedBean
@ApplicationScoped
public class XRFormValuesBean implements Serializable {
    private List<Double> xValues;
    private List<Double> rValues;

    public XRFormValuesBean() {
        xValues = List.of(-3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0);
        rValues = List.of(1.0, 1.5, 2.0, 2.5, 3.0);
    }

    public List<Double> getxValues() {
        return xValues;
    }

    public void setxValues(List<Double> xValues) {
        this.xValues = xValues;
    }

    public List<Double> getrValues() {
        return rValues;
    }

    public void setrValues(List<Double> rValues) {
        this.rValues = rValues;
    }
}
