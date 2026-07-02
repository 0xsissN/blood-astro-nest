import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorsService } from './donors.service';
import { Donor } from './entities/donor.entity';
import { BloodType } from './entities/blood-type.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('DonorsService', () => {
  let service: DonorsService;
  let donorRepository: Repository<Donor>;
  let bloodTypeRepository: Repository<BloodType>;

  const mockDonorRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockBloodTypeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonorsService,
        {
          provide: getRepositoryToken(Donor),
          useValue: mockDonorRepository,
        },
        {
          provide: getRepositoryToken(BloodType),
          useValue: mockBloodTypeRepository,
        },
      ],
    }).compile();

    service = module.get<DonorsService>(DonorsService);
    donorRepository = module.get<Repository<Donor>>(getRepositoryToken(Donor));
    bloodTypeRepository = module.get<Repository<BloodType>>(
      getRepositoryToken(BloodType),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a donor successfully', async () => {
      const createDto = {
        nombre: 'Juan',
        apellido: 'Perez',
        ci: '12345678',
        idTipoSangre: 1,
      };

      const bloodType = { id: 1, grupo: 'A', factorRh: '+' };
      const donor = { id: 1, ...createDto, activa: true };

      mockDonorRepository.findOne.mockResolvedValue(null);
      mockBloodTypeRepository.findOne.mockResolvedValue(bloodType);
      mockDonorRepository.create.mockReturnValue(donor);
      mockDonorRepository.save.mockResolvedValue(donor);

      const result = await service.create(createDto);

      expect(result.nombre).toBe('Juan');
      expect(result.ci).toBe('12345678');
    });

    it('should throw ConflictException when CI already exists', async () => {
      const createDto = {
        nombre: 'Juan',
        apellido: 'Perez',
        ci: '12345678',
        idTipoSangre: 1,
      };

      mockDonorRepository.findOne.mockResolvedValue({ id: 1, ci: '12345678' });

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException when blood type not found', async () => {
      const createDto = {
        nombre: 'Juan',
        apellido: 'Perez',
        ci: '12345678',
        idTipoSangre: 999,
      };

      mockDonorRepository.findOne.mockResolvedValue(null);
      mockBloodTypeRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a donor by id', async () => {
      const donor = { id: 1, nombre: 'Juan', tipoSangre: { id: 1 } };
      mockDonorRepository.findOne.mockResolvedValue(donor);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Juan');
    });

    it('should throw NotFoundException when donor not found', async () => {
      mockDonorRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft deactivate donor with donations', async () => {
      const donor = { id: 1, nombre: 'Juan', activo: true };
      mockDonorRepository.findOne.mockResolvedValue(donor);
      mockDonorRepository.save.mockResolvedValue({ ...donor, activo: false });

      const queryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
      };
      mockDonorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.remove(1);

      expect(result.desactivado).toBe(true);
    });

    it('should throw NotFoundException when donor not found', async () => {
      mockDonorRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
