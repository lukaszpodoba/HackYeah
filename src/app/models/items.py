from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Stop(Base):
    __tablename__ = 'stop'
    id = Column(Integer, primary_key=True)
    stop_code = Column(Integer)
    stop_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

    forms = relationship("Form", back_populates="stop")
    departures = relationship("Departure", back_populates="stop")


class Line(Base):
    __tablename__ = 'line'
    id = Column(Integer, primary_key=True)
    short_name = Column(String)
    long_name = Column(String)

    departures = relationship("Departure", back_populates="line")
    forms = relationship("Form", back_populates="line")
    users = relationship("User", back_populates="line")


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    password = Column(String)
    role = Column(String)
    line_id = Column(Integer, ForeignKey('line.id'))

    as_history = relationship("As_history", back_populates="user", cascade="all, delete-orphan")
    line = relationship("Line", back_populates="users")
    forms = relationship("Form", back_populates="user")


class As_history(Base):
    __tablename__ = 'as_history'
    id = Column(Integer, primary_key=True)
    as_user = Column(Integer)
    user_id = Column(Integer, ForeignKey('user.id'))

    user = relationship("User", back_populates="as_history")


class Departure(Base):
    __tablename__ = 'departure'
    id = Column(Integer, primary_key=True)
    line_id = Column(Integer, ForeignKey('line.id'))
    stop_id = Column(Integer, ForeignKey('stop.id'))
    planned_arrival_time = Column(DateTime)
    planned_departure_time = Column(DateTime)
    actual_arrival_time = Column(DateTime)
    actual_departure_time = Column(DateTime)

    line = relationship("Line", back_populates="departures")
    stop = relationship("Stop", back_populates="departures")
    forms = relationship("Form", back_populates="departure")


class Form(Base):
    __tablename__ = 'form'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    departure_id = Column(Integer, ForeignKey('departure.id'))
    report_time = Column(DateTime)
    as_form = Column(Integer)
    confirmed_by_admin = Column(Boolean)
    like_total = Column(Integer)
    dislike_total = Column(Integer)
    stop_id = Column(Integer, ForeignKey('stop.id'))
    category = Column(String)
    line_id = Column(Integer, ForeignKey('line.id'))
    delay = Column(Integer)

    user = relationship("User", back_populates="forms")
    departure = relationship("Departure", back_populates="forms")
    stop = relationship("Stop", back_populates="forms")
    line = relationship("Line", back_populates="forms")
