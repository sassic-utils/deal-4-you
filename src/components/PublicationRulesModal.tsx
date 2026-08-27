import { useState } from "react";
import type { CSSProperties } from "react";
import Modal from "./Modal";

function PublicationRulesModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        style={styles.rulesButton}
        onClick={() => setIsOpen(true)}
      >
        Правила публикации
      </button>

      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          ariaLabelledBy="publication-rules-title"
        >
          <div style={styles.header}>
            <span style={styles.icon}>📋</span>
            <div>
              <h2 id="publication-rules-title" style={styles.title}>
                Правила публикации
              </h2>
              <p style={styles.subtitle}>
                Чтобы объявления были понятными, безопасными и полезными.
              </p>
            </div>
          </div>

          <div style={styles.content}>
            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Можно публиковать</h3>

              <ul style={styles.list}>
                <li>Реальные товары, услуги, вакансии и предложения.</li>
                <li>Объявления с честным описанием и актуальной ценой.</li>
                <li>Собственные фотографии товара или понятные изображения.</li>
                <li>Контакты для связи: Telegram, телефон, email или сайт.</li>
                <li>Объявления, соответствующие законам вашей страны.</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Запрещено</h3>

              <ul style={styles.list}>
                <li>Мошенничество, обман, фишинг и подозрительные схемы.</li>
                <li>Продажа запрещённых товаров и услуг.</li>
                <li>Оружие, наркотики, поддельные документы и нелегальные услуги.</li>
                <li>Контент 18+, интимные услуги и эротические материалы.</li>
                <li>Оскорбления, угрозы, дискриминация и язык ненависти.</li>
                <li>Спам, массовые дубли объявлений и бессмысленный текст.</li>
                <li>Чужие фото, чужие бренды или материалы без права использования.</li>
                <li>Вредоносные ссылки, вирусы, пиратский софт и взломанные аккаунты.</li>
                <li>Объявления с ложной ценой, неверным городом или вводящим в заблуждение описанием.</li>
              </ul>
            </section>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Требования к объявлению</h3>

              <ul style={styles.list}>
                <li>Название должно коротко описывать суть объявления.</li>
                <li>Описание должно быть понятным и без лишнего капса.</li>
                <li>Цена должна быть реальной, если товар или услуга платные.</li>
                <li>Город и категория должны соответствовать объявлению.</li>
                <li>Фото не должно содержать запрещённый или оскорбительный контент.</li>
              </ul>
            </section>

            <section style={styles.warningBox}>
              <h3 style={styles.warningTitle}>Важно</h3>
              <p style={styles.warningText}>
                Администрация может не публиковать или удалить объявление без
                объяснения причин, если оно нарушает правила, выглядит
                подозрительно или может навредить другим пользователям.
              </p>
            </section>
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              style={styles.acceptButton}
              onClick={() => setIsOpen(false)}
            >
              Понятно
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  rulesButton: {
    flexShrink: 0,
    minHeight: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 10px",
    borderRadius: "999px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 900,
    lineHeight: 1.2,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 10px rgba(37, 99, 235, 0.18)",
  },

  header: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "22px 22px 14px",
    borderBottom: "1px solid #e5e7eb",
  },

  icon: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    paddingRight: "40px",
    color: "#111827",
    fontSize: "26px",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: 1.35,
  },

  content: {
    padding: "18px 22px",
  },

  section: {
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: "0 0 8px",
    color: "#111827",
    fontSize: "17px",
    lineHeight: 1.2,
  },

  list: {
    margin: 0,
    paddingLeft: "22px",
    color: "#374151",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  warningBox: {
    marginTop: "18px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
  },

  warningTitle: {
    margin: "0 0 6px",
    color: "#9a3412",
    fontSize: "16px",
    lineHeight: 1.2,
  },

  warningText: {
    margin: 0,
    color: "#7c2d12",
    fontSize: "14px",
    lineHeight: 1.45,
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "14px 22px 22px",
    borderTop: "1px solid #e5e7eb",
  },

  acceptButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "12px 20px",
    fontSize: "15px",
    lineHeight: 1,
    fontWeight: 900,
    cursor: "pointer",
  },
};

export default PublicationRulesModal;