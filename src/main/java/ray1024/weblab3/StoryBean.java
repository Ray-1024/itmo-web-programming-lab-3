package ray1024.weblab3;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.persistence.*;
import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;


@ManagedBean
@SessionScoped
public class StoryBean implements Serializable {

    private static final String persistenceUnit = "Studs";
    private final static int MAX_SIZE_OF_STORY = 10;
    private Point currPoint;
    private List<Point> points;
    private EntityManagerFactory entityManagerFactory;
    private EntityManager entityManager;
    private EntityTransaction transaction;

    public StoryBean() {
        currPoint = new Point();
        points = new LinkedList<>();
        connection();
        loadPoints();
    }

    private void connection() {
        entityManagerFactory = Persistence.createEntityManagerFactory(persistenceUnit);
        entityManager = entityManagerFactory.createEntityManager();
        transaction = entityManager.getTransaction();
    }

    private void loadPoints() {
        try {
            transaction.begin();
            Query query = entityManager.createQuery("SELECT e FROM Point e");
            points = query.getResultList();
            transaction.commit();
        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
        }
    }

    private boolean checkFields() {
        return (currPoint.getX() >= -3.0) && (currPoint.getX() <= 5.0) && (currPoint.getY() > -3.0) && (currPoint.getY() < 5.0) && (currPoint.getR() >= 1.0) && (currPoint.getR() <= 3.0);
    }

    public void addPoint() {
        if (true) {
            try {
                transaction.begin();
                currPoint.calcResult();
                entityManager.persist(currPoint);
                points.add(0, currPoint);
                currPoint = new Point();
                currPoint.setX(points.get(0).getX());
                currPoint.setY(points.get(0).getY());
                currPoint.setR(points.get(0).getR());
                transaction.commit();
            } catch (RuntimeException exception) {
                if (transaction.isActive()) {
                    transaction.rollback();
                }
            }
        }
    }

    public void clearEntries() {
        try {
            transaction.begin();
            Query query = entityManager.createQuery("DELETE FROM Point");
            query.executeUpdate();
            points.clear();
            transaction.commit();
        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
        }
    }

    public Point getCurrPoint() {
        return currPoint;
    }

    public void setCurrPoint(Point currPoint) {
        this.currPoint = currPoint;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }
}
