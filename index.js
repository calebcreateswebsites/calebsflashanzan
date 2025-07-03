import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Timer;
import java.util.TimerTask;
import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;

public class FlashAnzan extends JFrame {
    private final JLabel countdownLabel = new JLabel("Starting in 3...", SwingConstants.CENTER);
    private final JLabel numberLabel = new JLabel("", SwingConstants.CENTER);
    private final JTextField answerField = new JTextField();
    private final JButton submitButton = new JButton("Submit");
    private final JButton resetButton = new JButton("Reset");

    private final int[] numbers = {12, 7, 5, 9};
    private int current = 0;
    private final int sum = java.util.Arrays.stream(numbers).sum();

    public FlashAnzan() {
        setTitle("Flash Anzan");
        setSize(400, 300);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new GridLayout(5, 1));

        countdownLabel.setFont(new Font("Arial", Font.BOLD, 24));
        numberLabel.setFont(new Font("Arial", Font.BOLD, 60));
        countdownLabel.setForeground(Color.MAGENTA);
        numberLabel.setForeground(Color.MAGENTA);
        getContentPane().setBackground(Color.BLACK);

        add(countdownLabel);
        add(numberLabel);
        add(answerField);
        add(submitButton);
        add(resetButton);

        answerField.setVisible(false);
        submitButton.setVisible(false);
        resetButton.setVisible(false);

        submitButton.addActionListener(e -> {
            try {
                int input = Integer.parseInt(answerField.getText());
                String message = (input == sum) ? "Correct!" : "Incorrect. The correct sum is " + sum;
                JOptionPane.showMessageDialog(this, message);
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "Please enter a number.");
            }
        });

        resetButton.addActionListener(e -> reset());

        startCountdown();
    }

    private void startCountdown() {
        Timer timer = new Timer();
        final int[] count = {3};
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                countdownLabel.setText("Starting in " + count[0] + "...");
                count[0]--;
                if (count[0] < 0) {
                    timer.cancel();
                    countdownLabel.setVisible(false);
                    flashNumbers();
                }
            }
        }, 0, 1000);
    }

    private void flashNumbers() {
        Timer flashTimer = new Timer();
        flashTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                if (current < numbers.length) {
                    numberLabel.setText(String.valueOf(numbers[current]));
                    playBeep();
                    current++;
                } else {
                    flashTimer.cancel();
                    numberLabel.setText("");
                    answerField.setVisible(true);
                    submitButton.setVisible(true);
                    resetButton.setVisible(true);
                }
            }
        }, 0, 1000);
    }

    private void playBeep() {
        try {
            File beepFile = new File("beep.wav"); // Add a beep.wav file in the same directory
            AudioInputStream audio = AudioSystem.getAudioInputStream(beepFile);
            Clip clip = AudioSystem.getClip();
            clip.open(audio);
            clip.start();
        } catch (Exception e) {
            System.out.println("Beep sound failed: " + e.getMessage());
        }
    }

    private void reset() {
        current = 0;
        countdownLabel.setText("Starting in 3...");
        countdownLabel.setVisible(true);
        numberLabel.setText("");
        answerField.setText("");
        answerField.setVisible(false);
        submitButton.setVisible(false);
        resetButton.setVisible(false);
        startCountdown();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new FlashAnzan().setVisible(true));
    }
}
